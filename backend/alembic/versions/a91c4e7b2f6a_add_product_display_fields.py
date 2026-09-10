"""Add product display fields

Revision ID: a91c4e7b2f6a
Revises: f58c004c272e
Create Date: 2026-09-10 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a91c4e7b2f6a'
down_revision: Union[str, Sequence[str], None] = 'f58c004c272e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('products', sa.Column('subtitle', sa.String(), nullable=True))
    op.add_column('products', sa.Column('original_price', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('products', sa.Column('image', sa.String(), nullable=False, server_default=''))
    op.add_column('products', sa.Column('hover_image', sa.String(), nullable=True))
    op.add_column('products', sa.Column('badge', sa.String(), nullable=True))
    op.add_column('products', sa.Column('description', sa.Text(), nullable=False, server_default=''))
    op.add_column('products', sa.Column('sizes', sa.JSON(), nullable=False, server_default='[]'))
    op.add_column('products', sa.Column('colors', sa.JSON(), nullable=False, server_default='[]'))
    op.alter_column('products', 'image', server_default=None)
    op.alter_column('products', 'description', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('products', 'colors')
    op.drop_column('products', 'sizes')
    op.drop_column('products', 'description')
    op.drop_column('products', 'badge')
    op.drop_column('products', 'hover_image')
    op.drop_column('products', 'image')
    op.drop_column('products', 'original_price')
    op.drop_column('products', 'subtitle')
