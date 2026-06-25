from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_resource_leveling():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_resource_leveling(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_resource_leveling():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_resource_leveling(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_resource_leveling(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
