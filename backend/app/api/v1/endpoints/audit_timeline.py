from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_audit_timeline():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_audit_timeline(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_audit_timeline():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_audit_timeline(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_audit_timeline(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
