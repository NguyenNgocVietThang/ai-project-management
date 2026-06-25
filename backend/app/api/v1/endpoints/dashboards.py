from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_dashboards():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_dashboards(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_dashboards():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_dashboards(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_dashboards(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
