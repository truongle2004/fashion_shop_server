import { BaseEntity } from '@/shared/base.entity'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { ProductImageOrmEntity } from '@/api/products/infrastructure/orm-entities/productImage.orm-entity'

@Entity('products')
export class ProductOrmEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ type: 'varchar', length: 20 })
  category: string

  @Column({ type: 'varchar', length: 10 })
  currency: string

  @Column('simple-array')
  sizes: string[]

  @Column('simple-array')
  description_use: string[]

  @Column('simple-array')
  features: string[]

  @OneToMany(() => ProductImageOrmEntity, (image) => image.product, {
    cascade: true
  })
  @JoinColumn()
  images_color: ProductImageOrmEntity[]
}
