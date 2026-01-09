from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class CareerField(str, enum.Enum):
    SOFTWARE_ENGINEERING = "software_engineering"
    DATA_SCIENCE = "data_science"
    WEB_DEVELOPMENT = "web_development"
    MOBILE_DEVELOPMENT = "mobile_development"
    DEVOPS = "devops"
    CYBERSECURITY = "cybersecurity"
    AI_ML = "ai_ml"
    CLOUD_COMPUTING = "cloud_computing"
    UX_UI_DESIGN = "ux_ui_design"
    PRODUCT_MANAGEMENT = "product_management"
    GAME_DEVELOPMENT = "game_development"
    BLOCKCHAIN = "blockchain"


class ExperienceLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class CareerRole(Base):
    __tablename__ = "career_roles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    field = Column(Enum(CareerField), nullable=False)
    description = Column(Text, nullable=False)
    
    # Requirements
    required_skills = Column(JSON, default=list)
    recommended_skills = Column(JSON, default=list)
    tools_technologies = Column(JSON, default=list)
    
    # Market data
    average_salary_min = Column(Integer)
    average_salary_max = Column(Integer)
    demand_level = Column(Integer)  # 1-5
    growth_projection = Column(Float)  # Percentage
    
    # Learning path
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id"))
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    learning_path = relationship("LearningPath", back_populates="career_roles")
    assessments = relationship("CareerAssessment", back_populates="recommended_role")


class CareerAssessment(Base):
    __tablename__ = "career_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Assessment results
    answers = Column(JSON, nullable=False)
    personality_traits = Column(JSON, nullable=False)
    current_skills = Column(JSON, nullable=False)
    interests = Column(JSON, nullable=False)
    
    # Recommendations
    recommended_role_id = Column(Integer, ForeignKey("career_roles.id"))
    match_score = Column(Float)
    alternative_roles = Column(JSON, default=list)
    skill_gaps = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="career_assessments")
    recommended_role = relationship("CareerRole", back_populates="assessments")