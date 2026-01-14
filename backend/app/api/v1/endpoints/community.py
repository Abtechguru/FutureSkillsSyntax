"""Community API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.community import (
    PostCreate,
    PostResponse,
    CommentCreate,
    CommentResponse,
    ReactionCreate,
)

router = APIRouter()


# ============== Feed ==============

@router.get("/feed", response_model=List[PostResponse])
async def get_feed(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    category: Optional[str] = Query(None),
    content_type: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get activity feed."""
    user_id = current_user["user_id"]
    offset = (page - 1) * limit
    
    query = """
        SELECT 
            p.*,
            u.username as author_username,
            u.full_name as author_name,
            u.profile_picture_url as author_avatar,
            EXISTS(SELECT 1 FROM reactions r WHERE r.target_type = 'post' AND r.target_id = p.id AND r.user_id = :user_id) as is_liked,
            EXISTS(SELECT 1 FROM bookmarks b WHERE b.target_type = 'post' AND b.target_id = p.id AND b.user_id = :user_id) as is_bookmarked
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.is_published = true AND p.moderation_status = 'approved'
    """
    
    params = {"user_id": user_id, "limit": limit, "offset": offset}
    
    if category:
        query += " AND p.category = :category"
        params["category"] = category
    
    if content_type:
        query += " AND p.content_type = :content_type"
        params["content_type"] = content_type
    
    query += " ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT :limit OFFSET :offset"
    
    result = await db.execute(query, params)
    posts = result.fetchall()
    
    return [
        {
            "id": str(p.id),
            "author": {
                "id": str(p.author_id),
                "username": p.author_username,
                "full_name": p.author_name,
                "avatar_url": p.author_avatar,
            },
            "title": p.title,
            "content": p.content,
            "content_type": p.content_type,
            "images": p.images or [],
            "tags": p.tags or [],
            "category": p.category,
            "likes_count": p.likes_count,
            "comments_count": p.comments_count,
            "is_liked": p.is_liked,
            "is_bookmarked": p.is_bookmarked,
            "is_pinned": p.is_pinned,
            "created_at": p.created_at,
        }
        for p in posts
    ]


# ============== Posts ==============

@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new post."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        """
        INSERT INTO posts (author_id, title, content, content_type, images, tags, category)
        VALUES (:author_id, :title, :content, :content_type, :images, :tags, :category)
        RETURNING *
        """,
        {
            "author_id": user_id,
            "title": post_data.title,
            "content": post_data.content,
            "content_type": post_data.content_type or "text",
            "images": post_data.images or [],
            "tags": post_data.tags or [],
            "category": post_data.category,
        }
    )
    
    post = result.first()
    await db.commit()
    
    # Get author info
    author_result = await db.execute(
        "SELECT username, full_name, profile_picture_url FROM users WHERE id = :user_id",
        {"user_id": user_id}
    )
    author = author_result.first()
    
    return {
        "id": str(post.id),
        "author": {
            "id": user_id,
            "username": author.username,
            "full_name": author.full_name,
            "avatar_url": author.profile_picture_url,
        },
        "title": post.title,
        "content": post.content,
        "content_type": post.content_type,
        "images": post.images or [],
        "tags": post.tags or [],
        "category": post.category,
        "likes_count": 0,
        "comments_count": 0,
        "is_liked": False,
        "is_bookmarked": False,
        "is_pinned": False,
        "created_at": post.created_at,
    }


@router.get("/posts/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a single post with comments."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        """
        SELECT 
            p.*,
            u.username as author_username,
            u.full_name as author_name,
            u.profile_picture_url as author_avatar,
            EXISTS(SELECT 1 FROM reactions r WHERE r.target_type = 'post' AND r.target_id = p.id AND r.user_id = :user_id) as is_liked,
            EXISTS(SELECT 1 FROM bookmarks b WHERE b.target_type = 'post' AND b.target_id = p.id AND b.user_id = :user_id) as is_bookmarked
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.id = :post_id AND p.is_published = true
        """,
        {"post_id": post_id, "user_id": user_id}
    )
    
    post = result.first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Increment view count
    await db.execute(
        "UPDATE posts SET views_count = views_count + 1 WHERE id = :post_id",
        {"post_id": post_id}
    )
    await db.commit()
    
    return {
        "id": str(post.id),
        "author": {
            "id": str(post.author_id),
            "username": post.author_username,
            "full_name": post.author_name,
            "avatar_url": post.author_avatar,
        },
        "title": post.title,
        "content": post.content,
        "content_type": post.content_type,
        "images": post.images or [],
        "tags": post.tags or [],
        "category": post.category,
        "likes_count": post.likes_count,
        "comments_count": post.comments_count,
        "views_count": post.views_count + 1,
        "is_liked": post.is_liked,
        "is_bookmarked": post.is_bookmarked,
        "is_pinned": post.is_pinned,
        "created_at": post.created_at,
    }


@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a post."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        "DELETE FROM posts WHERE id = :post_id AND author_id = :user_id RETURNING id",
        {"post_id": post_id, "user_id": user_id}
    )
    
    if not result.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or not authorized"
        )
    
    await db.commit()
    return {"message": "Post deleted"}


# ============== Comments ==============

@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    post_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get comments for a post."""
    user_id = current_user["user_id"]
    
    result = await db.execute(
        """
        SELECT 
            c.*,
            u.username as author_username,
            u.full_name as author_name,
            u.profile_picture_url as author_avatar,
            EXISTS(SELECT 1 FROM reactions r WHERE r.target_type = 'comment' AND r.target_id = c.id AND r.user_id = :user_id) as is_liked
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.post_id = :post_id
        ORDER BY c.created_at ASC
        """,
        {"post_id": post_id, "user_id": user_id}
    )
    
    comments = result.fetchall()
    
    return [
        {
            "id": str(c.id),
            "author": {
                "id": str(c.author_id),
                "username": c.author_username,
                "full_name": c.author_name,
                "avatar_url": c.author_avatar,
            },
            "content": c.content,
            "likes_count": c.likes_count,
            "is_liked": c.is_liked,
            "parent_id": str(c.parent_id) if c.parent_id else None,
            "created_at": c.created_at,
        }
        for c in comments
    ]


@router.post("/posts/{post_id}/comment", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def add_comment(
    post_id: str,
    comment_data: CommentCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a comment to a post."""
    user_id = current_user["user_id"]
    
    # Verify post exists
    post_check = await db.execute(
        "SELECT id FROM posts WHERE id = :post_id AND is_published = true",
        {"post_id": post_id}
    )
    if not post_check.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    result = await db.execute(
        """
        INSERT INTO comments (post_id, author_id, content, parent_id)
        VALUES (:post_id, :author_id, :content, :parent_id)
        RETURNING *
        """,
        {
            "post_id": post_id,
            "author_id": user_id,
            "content": comment_data.content,
            "parent_id": comment_data.parent_id,
        }
    )
    
    comment = result.first()
    await db.commit()
    
    # Get author info
    author_result = await db.execute(
        "SELECT username, full_name, profile_picture_url FROM users WHERE id = :user_id",
        {"user_id": user_id}
    )
    author = author_result.first()
    
    return {
        "id": str(comment.id),
        "author": {
            "id": user_id,
            "username": author.username,
            "full_name": author.full_name,
            "avatar_url": author.profile_picture_url,
        },
        "content": comment.content,
        "likes_count": 0,
        "is_liked": False,
        "parent_id": str(comment.parent_id) if comment.parent_id else None,
        "created_at": comment.created_at,
    }


# ============== Reactions ==============

@router.post("/posts/{post_id}/react")
async def react_to_post(
    post_id: str,
    reaction_data: ReactionCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """React to a post (like/unlike toggle)."""
    user_id = current_user["user_id"]
    
    # Check if already reacted
    existing = await db.execute(
        "SELECT id FROM reactions WHERE user_id = :user_id AND target_type = 'post' AND target_id = :post_id",
        {"user_id": user_id, "post_id": post_id}
    )
    
    if existing.first():
        # Remove reaction
        await db.execute(
            "DELETE FROM reactions WHERE user_id = :user_id AND target_type = 'post' AND target_id = :post_id",
            {"user_id": user_id, "post_id": post_id}
        )
        await db.commit()
        return {"message": "Reaction removed", "is_liked": False}
    else:
        # Add reaction
        await db.execute(
            """
            INSERT INTO reactions (user_id, target_type, target_id, reaction_type)
            VALUES (:user_id, 'post', :post_id, :reaction_type)
            """,
            {"user_id": user_id, "post_id": post_id, "reaction_type": reaction_data.reaction_type or "like"}
        )
        await db.commit()
        return {"message": "Reaction added", "is_liked": True}


# ============== Bookmarks ==============

@router.post("/posts/{post_id}/bookmark")
async def toggle_bookmark(
    post_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle bookmark on a post."""
    user_id = current_user["user_id"]
    
    existing = await db.execute(
        "SELECT id FROM bookmarks WHERE user_id = :user_id AND target_type = 'post' AND target_id = :post_id",
        {"user_id": user_id, "post_id": post_id}
    )
    
    if existing.first():
        await db.execute(
            "DELETE FROM bookmarks WHERE user_id = :user_id AND target_type = 'post' AND target_id = :post_id",
            {"user_id": user_id, "post_id": post_id}
        )
        await db.commit()
        return {"message": "Bookmark removed", "is_bookmarked": False}
    else:
        await db.execute(
            "INSERT INTO bookmarks (user_id, target_type, target_id) VALUES (:user_id, 'post', :post_id)",
            {"user_id": user_id, "post_id": post_id}
        )
        await db.commit()
        return {"message": "Bookmark added", "is_bookmarked": True}


# ============== Follows ==============

@router.post("/users/{target_user_id}/follow")
async def toggle_follow(
    target_user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Follow/unfollow a user."""
    user_id = current_user["user_id"]
    
    if user_id == target_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot follow yourself"
        )
    
    existing = await db.execute(
        "SELECT id FROM follows WHERE follower_id = :user_id AND following_id = :target_id",
        {"user_id": user_id, "target_id": target_user_id}
    )
    
    if existing.first():
        await db.execute(
            "DELETE FROM follows WHERE follower_id = :user_id AND following_id = :target_id",
            {"user_id": user_id, "target_id": target_user_id}
        )
        await db.commit()
        return {"message": "Unfollowed", "is_following": False}
    else:
        await db.execute(
            "INSERT INTO follows (follower_id, following_id) VALUES (:user_id, :target_id)",
            {"user_id": user_id, "target_id": target_user_id}
        )
        await db.commit()
        return {"message": "Following", "is_following": True}
