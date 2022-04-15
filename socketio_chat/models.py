from datetime import datetime
from uuid import UUID, uuid4
import pydantic


class Message(pydantic.BaseModel):
    id: UUID = pydantic.Field(default_factory=uuid4)
    sentOn: datetime = pydantic.Field(
        default_factory=datetime.utcnow,
        description="Date and time when this message where emitted.",
    )
    message: str = pydantic.Field(description="The message text.")
    sender: str = pydantic.Field(description="The message sender user ID.")


class User(pydantic.BaseModel):
    id: str = pydantic.Field(description="The User ID.")
    name: str | None = pydantic.Field(None, description="A display name.")
