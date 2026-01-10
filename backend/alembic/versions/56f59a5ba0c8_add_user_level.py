"""add user level

Revision ID: 56f59a5ba0c8
Revises: add_user_level
Create Date: 2026-01-06 18:29:55.574164

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '56f59a5ba0c8'
down_revision: Union[str, None] = 'add_user_level'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("level", sa.String(), nullable=True)
    )


def downgrade():
    op.drop_column("users", "level")


