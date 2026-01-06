"""Add user level field

Revision ID: add_user_level
Revises: ff7871843d73
Create Date: 2024-01-01 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'add_user_level'
down_revision: Union[str, None] = 'ff7871843d73'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE TYPE userlevel AS ENUM ('beginner', 'intermediate', 'advanced')")
    op.add_column('users', sa.Column('level', postgresql.ENUM('beginner', 'intermediate', 'advanced', name='userlevel', create_type=False), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'level')
    op.execute("DROP TYPE IF EXISTS userlevel")

