from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_leaves():
    # TODO: Cài đặt hàm list
    return []


@router.get("/{id}")
async def get_leaves(id: int):
    # TODO: Cài đặt hàm lấy theo id
    return {"id": id}


@router.post("/")
async def create_leaves():
    # TODO: Cài đặt hàm tạo mới
    return {"message": "Created"}


@router.put("/{id}")
async def update_leaves(id: int):
    # TODO: Cài đặt hàm cập nhật
    return {"message": "Updated"}


@router.delete("/{id}")
async def delete_leaves(id: int):
    # TODO: Cài đặt hàm xóa
    return {"message": "Deleted"}
