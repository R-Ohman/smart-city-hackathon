from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.air.router import router as air_router
from app.geo_search.router import router as geo_router

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
app.include_router(geo_router, prefix="/api/geo", tags=["Geo search"])


@app.get("/health-check")
def health_check():
    return {"status": "ok hi"}
