import { IsArray, IsNumber, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class GeoJSONPolygonDto {
  @IsString()
  type: 'Polygon';

  @IsArray()
  coordinates: number[][][];
}

export class QuerySoilDto {
  @ValidateNested()
  @Type(() => GeoJSONPolygonDto)
  polygon: GeoJSONPolygonDto;

  @IsOptional()
  @IsString()
  provider?: string;  // Optional provider override (defaults to best available)
}

export class GetMapUnitDto {
  @IsString()
  mukey: string;

  @IsOptional()
  @IsString()
  provider?: string;
}
