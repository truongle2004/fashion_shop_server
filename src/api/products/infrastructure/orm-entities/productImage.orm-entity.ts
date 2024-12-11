import { BaseEntity } from '@/shared/base.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { ProductOrmEntity } from './product.orm-entity'

@Entity('product_images')
export class ProductImageOrmEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  url: string

  @Column({ type: 'varchar', length: 50 })
  color: string

  @ManyToOne(() => ProductOrmEntity, (product) => product.images_color)
  product: ProductOrmEntity
}
