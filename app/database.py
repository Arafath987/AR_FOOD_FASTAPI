from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

SQL_DATABASE_URL = "mysql+aiomysql://root:test1234!@127.0.0.1:3306/AR_FOOD_DATABASE"
engine = create_async_engine(SQL_DATABASE_URL, echo=False, future=True)


async_sessionlocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_db():
    async with async_sessionlocal() as db:
        try:
            yield db
        finally:
            await db.close()
