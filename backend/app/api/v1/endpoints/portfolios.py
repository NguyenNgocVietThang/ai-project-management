from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_portfolios():
    # TODO: Implement list
    return []


@router.get("/{id}")
async def get_portfolios(id: int):
    # TODO: Implement get by id
    return {"id": id}


@router.post("/")
async def create_portfolios():
    # TODO: Implement create
    return {"message": "Created"}


@router.put("/{id}")
async def update_portfolios(id: int):
    # TODO: Implement update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_portfolios(id: int):
    # TODO: Implement delete
    return {"message": "Deleted"}
