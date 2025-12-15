import http


class HTTPException(Exception):
    def __init__(self, status_code: int, detail: str | None = None) -> None:
        if detail is None:
            http_status = http.HTTPStatus(status_code)
            detail = http_status.phrase

        self.status_code = status_code
        self.detail = detail

    def __str__(self) -> str:
        return f"{self.status_code}: {self.detail}"

    def __repr__(self) -> str:
        class_name = self.__class__.__name__
        return f"{class_name}(status_code={self.status_code!r}, detail={self.detail!r})"
