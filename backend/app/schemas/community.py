"""Community schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ContentType(str, Enum):
    TEXT = "text"
    CODE = "code"
    QUESTION = "question"
    ACHIEVEMENT = "achievement"
    PROJECT = "project"


class ReactionType(str, Enum):
    LIKE = "like"
    LOVE = "love"
    CELEBRATE = "celebrate"
    SUPPORT = "support"
    INSIGHTFUL = "insightful"


# ============== Author ==============

class AuthorInfo(BaseModel):
    id: str
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


# ============== Posts ==============

class PostCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=300)
    content: str = Field(..., min_length=1)
    content_type: Optional[ContentType] = ContentType.TEXT
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=300)
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None


class PostResponse(BaseModel):
    id: str
    author: AuthorInfo
    title: Optional[str] = None
    content: str
    content_type: ContentType
    images: List[str] = []
    tags: List[str] = []
    category: Optional[str] = None
    likes_count: int = 0
    comments_count: int = 0
    views_count: Optional[int] = None
    is_liked: bool = False
    is_bookmarked: bool = False
    is_pinned: bool = False
    created_at: datetime


# ============== Comments ==============

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    parent_id: Optional[str] = None


class CommentResponse(BaseModel):
    id: str
    author: AuthorInfo
    content: str
    likes_count: int = 0
    is_liked: bool = False
    parent_id: Optional[str] = None
    created_at: datetime


# ============== Reactions ==============

class ReactionCreate(BaseModel):
    reaction_type: Optional[ReactionType] = ReactionType.LIKE


# ============== Follows ==============

class FollowStats(BaseModel):
    followers_count: int
    following_count: int
    is_following: bool = False
