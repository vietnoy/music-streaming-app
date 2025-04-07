from fastapi import Depends
from typing import Annotated
from sqlalchemy.orm import Session
from .database import get_db

db_dependency = Annotated[Session, Depends(get_db)]
# user_dependency = Annotated[dict, Depends(get_current_user)]