from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from air.router import router as air_router

app = FastAPI()


origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(air_router, prefix="/api/air", tags=["Air API"])


@app.get("/health-check")
def health_check():
    return {"status": "ok"}
