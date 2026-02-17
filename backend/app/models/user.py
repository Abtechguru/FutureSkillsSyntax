from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MENTOR = "mentor"
    MENTEE = "mentee"
    CAREER_SEEKER = "career_seeker"
    PARENT_GUARDIAN = "parent_guardian"


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    NON_BINARY = "non_binary"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    role = Column(Enum(UserRole), default=UserRole.CAREER_SEEKER)
    gender = Column(Enum(Gender), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    
    # Profile information
    bio = Column(Text, nullable=True)
    profile_picture_url = Column(String(500), nullable=True)
    phone_number = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    
    # FutureSyntax specific
    is_futuresyntax_mentee = Column(Boolean, default=False)
    guardian_email = Column(String(255), nullable=True)
    guardian_verified = Column(Boolean, default=False)
    
    # Gamification
    experience_points = Column(Integer, default=0)
    current_level = Column(Integer, default=1)
    badges = Column(JSON, default=list)  # List of badge IDs
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    career_assessments = relationship("CareerAssessment", back_populates="user")
    mentorship_sessions = relationship("MentorshipSession", foreign_keys="MentorshipSession.mentee_id", back_populates="mentee")
    mentor_assignments = relationship("MentorAssignment", foreign_keys="MentorAssignment.mentor_id", back_populates="mentor")
    mentee_assignments = relationship("MentorAssignment", foreign_keys="MentorAssignment.mentee_id", back_populates="mentee")
    learning_progress = relationship("LearningProgress", back_populates="user")