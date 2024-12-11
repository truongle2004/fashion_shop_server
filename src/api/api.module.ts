import { Module } from '@nestjs/common'
import { AuthModule } from '@/api/auth/auth.module'
import { ProductsModule } from '@/api/products/products.module'

@Module({
  imports: [AuthModule, ProductsModule]
})
export class ApiModule {}
