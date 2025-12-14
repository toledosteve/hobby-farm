import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsArray,
  IsObject,
} from 'class-validator';
import { Boundary, MapMarker, MapPath, MapZone } from '../schemas/project.schema';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  acres?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  enabledModules?: string[];

  @IsObject()
  @IsOptional()
  boundary?: Boundary | null;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsArray()
  @IsOptional()
  markers?: MapMarker[];

  @IsArray()
  @IsOptional()
  paths?: MapPath[];

  @IsArray()
  @IsOptional()
  zones?: MapZone[];
}
