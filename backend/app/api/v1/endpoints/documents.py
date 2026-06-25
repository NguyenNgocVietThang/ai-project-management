from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_documents():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_documents(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_documents():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_documents(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_documents(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
