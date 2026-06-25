from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_phases():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_phases(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_phases():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_phases(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_phases(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
