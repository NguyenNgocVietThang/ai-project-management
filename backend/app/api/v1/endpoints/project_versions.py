from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_project_versions():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_project_versions(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_project_versions():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_project_versions(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_project_versions(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
