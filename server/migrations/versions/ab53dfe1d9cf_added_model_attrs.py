"""added model attrs

Revision ID: ab53dfe1d9cf
Revises: 9f0fa688a7c2
Create Date: 2024-11-08 15:46:48.518757

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab53dfe1d9cf'
down_revision = '9f0fa688a7c2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('categories', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.String(), nullable=False))
        batch_op.create_unique_constraint('unique_category_name', ['name'])

    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('email', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('_password_hash', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('first_name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('last_name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('phone_number', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))
        batch_op.create_unique_constraint('unique_customer_email', ['email'])
        batch_op.create_unique_constraint('unique_customer_phone_number', ['phone_number'])
        batch_op.create_unique_constraint('unique_customer_username', ['username'])

    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('image', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False))
        batch_op.create_unique_constraint('unique_item_name', ['name'])

    with op.batch_alter_table('order_items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('item_id', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('order_id', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('quantity', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('special_instructions', sa.String(), nullable=False))
        batch_op.create_foreign_key(batch_op.f('fk_order_items_order_id_orders'), 'orders', ['order_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_order_items_item_id_items'), 'items', ['item_id'], ['id'])

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('customer_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('order_type', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('pickup_time', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('total_price', sa.Numeric(precision=10, scale=2), nullable=False))
        batch_op.add_column(sa.Column('order_status', sa.String(), nullable=False))
        batch_op.create_foreign_key(batch_op.f('fk_orders_customer_id_customers'), 'customers', ['customer_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_orders_customer_id_customers'), type_='foreignkey')
        batch_op.drop_column('order_status')
        batch_op.drop_column('total_price')
        batch_op.drop_column('pickup_time')
        batch_op.drop_column('order_type')
        batch_op.drop_column('created_at')
        batch_op.drop_column('customer_id')

    with op.batch_alter_table('order_items', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_order_items_item_id_items'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_order_items_order_id_orders'), type_='foreignkey')
        batch_op.drop_column('special_instructions')
        batch_op.drop_column('quantity')
        batch_op.drop_column('order_id')
        batch_op.drop_column('item_id')

    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('price')
        batch_op.drop_column('description')
        batch_op.drop_column('image')
        batch_op.drop_column('name')

    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('created_at')
        batch_op.drop_column('phone_number')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
        batch_op.drop_column('_password_hash')
        batch_op.drop_column('email')
        batch_op.drop_column('username')

    with op.batch_alter_table('categories', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('description')
        batch_op.drop_column('name')

    # ### end Alembic commands ###
