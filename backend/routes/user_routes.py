from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def test_route():
    return {"message": "User route is working"}