from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, JSON, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class SessionStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    MISSED = "missed"


class WeekFocus(str, enum.Enum):
    CODING_BASICS = "coding_basics"
    DIGITAL_LITERACY = "digital_literacy"
    RESPONSIBILITY = "responsibility"
    DISCIPLINE = "discipline"
    FINANCIAL_AWARENESS = "financial_awareness"
    GROWTH_MINDSET = "growth_mindset"
    PROJECT_WORK = "project_work"


class MentorAssignment(Base):
    __tablename__ = "mentor_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Assignment details
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Progress tracking
    current_week = Column(Integer, default=1)
    completed_modules = Column(JSON, default=list)
    overall_progress = Column(Float, default=0.0)
    
    # Metrics
    mentee_satisfaction = Column(Float, nullable=True)
    mentor_feedback = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    mentor = relationship("User", foreign_keys=[mentor_id], back_populates="mentor_assignments")
    mentee = relationship("User", foreign_keys=[mentee_id], back_populates="mentee_assignments")
    sessions = relationship("MentorshipSession", back_populates="assignment")
    tasks = relationship("MentorshipTask", back_populates="assignment")


class MentorshipSession(Base):
    __tablename__ = "mentorship_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("mentor_assignments.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Session details
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    week_focus = Column(Enum(WeekFocus), nullable=False)
    session_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=60)
    status = Column(Enum(SessionStatus), default=SessionStatus.SCHEDULED)
    
    # Content
    learning_objectives = Column(JSON, default=list)
    resources = Column(JSON, default=list)
    discussion_points = Column(JSON, default=list)
    classroom_link = Column(String(500), nullable=True)
    
    # Notes & Feedback
    mentor_notes = Column(Text, nullable=True)
    mentee_reflection = Column(Text, nullable=True)
    session_rating = Column(Integer, nullable=True)  # 1-5
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    assignment = relationship("MentorAssignment", back_populates="sessions")
    mentee = relationship("User", foreign_keys=[mentee_id], back_populates="mentorship_sessions")
    collaboration = relationship("CollaborativeSession", back_populates="session", uselist=False)


class MentorshipTask(Base):
    __tablename__ = "mentorship_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("mentor_assignments.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    code_stub = Column(Text, nullable=True)
    language = Column(String(50), default="javascript")
    due_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="assigned")  # assigned, in_progress, submitted, reviewed
    mentor_feedback = Column(Text, nullable=True)
    grade = Column(String(10), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    assignment = relationship("MentorAssignment", back_populates="tasks")
    submissions = relationship("TaskSubmission", back_populates="task")


class TaskSubmission(Base):
    __tablename__ = "task_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("mentorship_tasks.id"), nullable=False)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submitted_code = Column(Text, nullable=False)
    output = Column(Text, nullable=True)
    mentor_comments = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    task = relationship("MentorshipTask", back_populates="submissions")


class CollaborativeSession(Base):
    __tablename__ = "collaborative_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("mentorship_sessions.id"), nullable=False)
    current_code = Column(Text, default="")
    language = Column(String(50), default="javascript")
    is_active = Column(Boolean, default=True)
    last_updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    session = relationship("MentorshipSession", back_populates="collaboration")