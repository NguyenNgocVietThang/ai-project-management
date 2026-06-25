from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_change_requests():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_change_requests(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_change_requests():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_change_requests(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_change_requests(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
