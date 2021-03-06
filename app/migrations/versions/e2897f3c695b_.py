"""empty message

Revision ID: e2897f3c695b
Revises: None
Create Date: 2016-03-22 18:50:31.227939

"""

# revision identifiers, used by Alembic.
revision = 'e2897f3c695b'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('competenceprofile', sa.Column('description', sa.String(length=4000), nullable=True))
    op.add_column('customer', sa.Column('customerno', sa.String(length=32), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('customer', 'customerno')
    op.drop_column('competenceprofile', 'description')
    ### end Alembic commands ###
