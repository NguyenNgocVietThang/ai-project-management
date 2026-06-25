from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_users():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_users(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_users():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_users(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_users(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
