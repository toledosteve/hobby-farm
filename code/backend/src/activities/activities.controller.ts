import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  /**
   * Get activities for a specific project
   * GET /activities?projectId=xxx&limit=20
   */
  @Get()
  async findByProject(
    @Request() req,
    @Query('projectId') projectId: string,
    @Query('limit') limit?: string,
  ) {
    if (!projectId) {
      return [];
    }
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.activitiesService.findByProject(req.user.id, projectId, limitNum);
  }

  /**
   * Get recent activities across all projects
   * GET /activities/recent?limit=10
   */
  @Get('recent')
  async findRecent(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.activitiesService.findRecent(req.user.id, limitNum);
  }
}
