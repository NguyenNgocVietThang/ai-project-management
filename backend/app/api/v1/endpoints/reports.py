from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_reports():
    # TODO: Cài đặt hàm list
    return []


@router.get("/{id}")
async def get_reports(id: int):
    # TODO: Cài đặt hàm get theo id
    return {"id": id}


@router.post("/")
async def create_reports():
    # TODO: Cài đặt hàm create
    return {"message": "Created"}


@router.put("/{id}")
async def update_reports(id: int):
    # TODO: Cài đặt hàm update
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_reports(id: int):
    # TODO: Cài đặt hàm delete
    return {"message": "Deleted"}
