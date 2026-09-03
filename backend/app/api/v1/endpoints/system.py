from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_system():
    # TODO: Cài đặt hàm list
    return []


@router.get("/{id}")
async def get_system(id: int):
    # TODO: Cài đặt hàm get theo id
    return {"id": id}


@router.post("/")
async def create_system():
    # TODO: Cài đặt hàm create
    return {"message": "Created"}


@router.put("/{id}")
async def update_system(id: int):
    # TODO: Cài đặt hàm update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_system(id: int):
    # TODO: Cài đặt hàm delete
    return {"message": "Deleted"}
