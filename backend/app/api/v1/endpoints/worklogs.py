from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_worklogs():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_worklogs(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_worklogs():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_worklogs(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_worklogs(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
