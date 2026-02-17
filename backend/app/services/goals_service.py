"""Goals service layer for MongoDB operations."""

from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from bson import ObjectId

from app.models.goals import (
    GoalDB, MilestoneDB, HabitDB, HabitCompletionDB,
    CheckInDB, MetricDB, MetricEntryDB, GoalSupportDB
)
from app.schemas.goals import (
    GoalCreate, GoalUpdate, HabitCreate, HabitUpdate,
    CheckInCreate, MetricCreate, MetricEntryCreate,
    GoalStatus
)
from app.core.mongodb import Collections


class GoalsService:
    """Service for goal-related operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.goals_collection = db[Collections.GOALS]
        self.milestones_collection = db[Collections.MILESTONES]
    
    async def create_goal(self, user_id: str, goal_data: GoalCreate) -> GoalDB:
        """Create a new goal."""
        goal_dict = goal_data.dict(exclude={'milestones'})
        goal_dict['user_id'] = user_id
        goal_dict['created_at'] = datetime.utcnow()
        goal_dict['updated_at'] = datetime.utcnow()
        goal_dict['status'] = GoalStatus.ACTIVE.value
        goal_dict['current_value'] = goal_data.current_value or 0
        goal_dict['progress_percentage'] = 0
        goal_dict['streak_days'] = 0
        goal_dict['total_check_ins'] = 0
        goal_dict['supporters_count'] = 0
        
        result = await self.goals_collection.insert_one(goal_dict)
        goal_dict['_id'] = str(result.inserted_id)
        
        # Create milestones if provided
        if goal_data.milestones:
            for milestone_data in goal_data.milestones:
                milestone_dict = milestone_data.dict()
                milestone_dict['goal_id'] = goal_dict['_id']
                milestone_dict['created_at'] = datetime.utcnow()
                milestone_dict['current_value'] = 0
                milestone_dict['is_completed'] = False
                await self.milestones_collection.insert_one(milestone_dict)
        
        return GoalDB(**goal_dict)
    
    async def get_goals(
        self,
        user_id: str,
        status: Optional[str] = None,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        is_public: Optional[bool] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[GoalDB]:
        """Get goals with filters."""
        query = {'user_id': user_id}
        
        if status:
            query['status'] = status
        if category:
            query['category'] = category
        if priority:
            query['priority'] = priority
        if is_public is not None:
            query['is_public'] = is_public
        
        cursor = self.goals_collection.find(query).skip(skip).limit(limit).sort('created_at', -1)
        goals = await cursor.to_list(length=limit)
        
        return [GoalDB(**{**goal, '_id': str(goal['_id'])}) for goal in goals]
    
    async def get_goal_by_id(self, goal_id: str, user_id: str) -> Optional[GoalDB]:
        """Get a specific goal."""
        goal = await self.goals_collection.find_one({'_id': ObjectId(goal_id), 'user_id': user_id})
        if goal:
            goal['_id'] = str(goal['_id'])
            return GoalDB(**goal)
        return None
    
    async def update_goal(self, goal_id: str, user_id: str, goal_update: GoalUpdate) -> Optional[GoalDB]:
        """Update a goal."""
        update_data = goal_update.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        
        # If status changed to completed, set completed_at
        if goal_update.status == GoalStatus.COMPLETED:
            update_data['completed_at'] = datetime.utcnow()
        
        result = await self.goals_collection.find_one_and_update(
            {'_id': ObjectId(goal_id), 'user_id': user_id},
            {'$set': update_data},
            return_document=True
        )
        
        if result:
            result['_id'] = str(result['_id'])
            return GoalDB(**result)
        return None
    
    async def delete_goal(self, goal_id: str, user_id: str) -> bool:
        """Delete a goal."""
        result = await self.goals_collection.delete_one({'_id': ObjectId(goal_id), 'user_id': user_id})
        # Also delete associated milestones
        await self.milestones_collection.delete_many({'goal_id': goal_id})
        return result.deleted_count > 0
    
    async def update_progress(self, goal_id: str, user_id: str, progress_value: float) -> Optional[GoalDB]:
        """Update goal progress."""
        goal = await self.get_goal_by_id(goal_id, user_id)
        if not goal:
            return None
        
        new_current_value = goal.current_value + progress_value
        progress_percentage = 0
        
        if goal.target_value and goal.target_value > 0:
            progress_percentage = min(100, (new_current_value / goal.target_value) * 100)
        
        update_data = {
            'current_value': new_current_value,
            'progress_percentage': progress_percentage,
            'updated_at': datetime.utcnow()
        }
        
        # Auto-complete if reached 100%
        if progress_percentage >= 100 and goal.status != GoalStatus.COMPLETED.value:
            update_data['status'] = GoalStatus.COMPLETED.value
            update_data['completed_at'] = datetime.utcnow()
        
        result = await self.goals_collection.find_one_and_update(
            {'_id': ObjectId(goal_id), 'user_id': user_id},
            {'$set': update_data},
            return_document=True
        )
        
        if result:
            result['_id'] = str(result['_id'])
            return GoalDB(**result)
        return None


class HabitsService:
    """Service for habit-related operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.habits_collection = db[Collections.HABITS]
        self.completions_collection = db[Collections.HABIT_COMPLETIONS]
    
    async def create_habit(self, user_id: str, habit_data: HabitCreate) -> HabitDB:
        """Create a new habit."""
        habit_dict = habit_data.dict()
        habit_dict['user_id'] = user_id
        habit_dict['created_at'] = datetime.utcnow()
        habit_dict['updated_at'] = datetime.utcnow()
        habit_dict['is_active'] = True
        habit_dict['current_streak'] = 0
        habit_dict['longest_streak'] = 0
        habit_dict['total_completions'] = 0
        habit_dict['completion_rate'] = 0
        habit_dict['this_week_completions'] = 0
        habit_dict['this_month_completions'] = 0
        
        result = await self.habits_collection.insert_one(habit_dict)
        habit_dict['_id'] = str(result.inserted_id)
        
        return HabitDB(**habit_dict)
    
    async def get_habits(
        self,
        user_id: str,
        category: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> List[HabitDB]:
        """Get habits with filters."""
        query = {'user_id': user_id}
        
        if category:
            query['category'] = category
        if is_active is not None:
            query['is_active'] = is_active
        
        cursor = self.habits_collection.find(query).sort('created_at', -1)
        habits = await cursor.to_list(length=None)
        
        return [HabitDB(**{**habit, '_id': str(habit['_id'])}) for habit in habits]
    
    async def complete_habit(self, habit_id: str, user_id: str, note: Optional[str] = None) -> Dict[str, Any]:
        """Mark habit as completed."""
        # Check if already completed today
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        existing = await self.completions_collection.find_one({
            'habit_id': habit_id,
            'user_id': user_id,
            'completed_at': {'$gte': today_start}
        })
        
        if existing:
            raise ValueError("Habit already completed today")
        
        # Create completion record
        completion = {
            'habit_id': habit_id,
            'user_id': user_id,
            'note': note,
            'completed_at': datetime.utcnow()
        }
        await self.completions_collection.insert_one(completion)
        
        # Update habit stats
        habit = await self.habits_collection.find_one({'_id': ObjectId(habit_id), 'user_id': user_id})
        if not habit:
            raise ValueError("Habit not found")
        
        # Calculate streak
        current_streak = await self._calculate_streak(habit_id, user_id)
        
        # Update counts
        week_start = datetime.utcnow() - timedelta(days=datetime.utcnow().weekday())
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        this_week = await self.completions_collection.count_documents({
            'habit_id': habit_id,
            'completed_at': {'$gte': week_start}
        })
        
        this_month = await self.completions_collection.count_documents({
            'habit_id': habit_id,
            'completed_at': {'$gte': month_start}
        })
        
        total = await self.completions_collection.count_documents({'habit_id': habit_id})
        
        update_data = {
            'total_completions': total,
            'current_streak': current_streak,
            'longest_streak': max(habit.get('longest_streak', 0), current_streak),
            'this_week_completions': this_week,
            'this_month_completions': this_month,
            'updated_at': datetime.utcnow()
        }
        
        await self.habits_collection.update_one(
            {'_id': ObjectId(habit_id)},
            {'$set': update_data}
        )
        
        return {
            'message': 'Habit completed!',
            'streak': current_streak,
            'total_completions': total
        }
    
    async def _calculate_streak(self, habit_id: str, user_id: str) -> int:
        """Calculate current streak for a habit."""
        completions = await self.completions_collection.find({
            'habit_id': habit_id,
            'user_id': user_id
        }).sort('completed_at', -1).to_list(length=None)
        
        if not completions:
            return 0
        
        streak = 0
        current_date = datetime.utcnow().date()
        
        for completion in completions:
            completion_date = completion['completed_at'].date()
            
            if completion_date == current_date or completion_date == current_date - timedelta(days=streak):
                streak += 1
                current_date = completion_date - timedelta(days=1)
            else:
                break
        
        return streak


class CheckInsService:
    """Service for check-in operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.check_ins_collection = db[Collections.CHECK_INS]
        self.goals_collection = db[Collections.GOALS]
    
    async def create_check_in(self, user_id: str, check_in_data: CheckInCreate) -> CheckInDB:
        """Create a daily check-in."""
        check_in_dict = check_in_data.dict()
        check_in_dict['user_id'] = user_id
        check_in_dict['created_at'] = datetime.utcnow()
        check_in_dict['supporters_count'] = 0
        check_in_dict['comments_count'] = 0
        
        result = await self.check_ins_collection.insert_one(check_in_dict)
        check_in_dict['_id'] = str(result.inserted_id)
        
        # Update goal check-in count if linked
        if check_in_data.goal_id:
            await self.goals_collection.update_one(
                {'_id': ObjectId(check_in_data.goal_id)},
                {'$inc': {'total_check_ins': 1}}
            )
        
        return CheckInDB(**check_in_dict)
    
    async def get_check_ins(
        self,
        user_id: str,
        goal_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 30
    ) -> List[CheckInDB]:
        """Get check-ins."""
        query = {'user_id': user_id}
        
        if goal_id:
            query['goal_id'] = goal_id
        
        cursor = self.check_ins_collection.find(query).skip(skip).limit(limit).sort('created_at', -1)
        check_ins = await cursor.to_list(length=limit)
        
        return [CheckInDB(**{**ci, '_id': str(ci['_id'])}) for ci in check_ins]
    
    async def get_community_check_ins(self, skip: int = 0, limit: int = 20) -> List[CheckInDB]:
        """Get public check-ins from community."""
        cursor = self.check_ins_collection.find({'is_public': True}).skip(skip).limit(limit).sort('created_at', -1)
        check_ins = await cursor.to_list(length=limit)
        
        return [CheckInDB(**{**ci, '_id': str(ci['_id'])}) for ci in check_ins]
