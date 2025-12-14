import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectDocument, Season } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ActivitiesService } from '../activities/activities.service';

// Module name mapping for activity logging
const MODULE_NAMES: Record<string, string> = {
  maple: 'Maple Sugaring',
  poultry: 'Poultry',
  garden: 'Gardening',
  orchard: 'Orchard',
  'christmas-trees': 'Christmas Trees',
  wildlife: 'Wildlife Habitat',
};

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private activitiesService: ActivitiesService,
  ) {}

  // Helper to compute location from address fields
  private computeLocation(data: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }): string {
    const parts: string[] = [];
    if (data.address) parts.push(data.address);
    if (data.city || data.state || data.zipCode) {
      const stateZip = data.state
        ? data.zipCode
          ? `${data.state} ${data.zipCode}`
          : data.state
        : data.zipCode;
      const cityStateZip = [data.city, stateZip].filter(Boolean).join(', ');
      if (cityStateZip) parts.push(cityStateZip);
    }
    return parts.join(', ');
  }

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    // Compute location from address fields
    const location = this.computeLocation(createProjectDto);

    const project = new this.projectModel({
      ...createProjectDto,
      location,
      userId: new Types.ObjectId(userId),
    });
    const savedProject = await project.save();

    // Log activity
    await this.activitiesService.logProjectActivity(
      userId,
      savedProject._id.toString(),
      `Created farm: ${savedProject.name}`,
    );

    return savedProject;
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.projectModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Project> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Project not found');
    }

    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Ensure user owns this project
    if (project.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const existingProject = await this.findOne(id, userId); // Verify ownership

    // Check if any address fields are being updated with different values
    const addressFieldsChanged =
      (updateProjectDto.address !== undefined &&
        updateProjectDto.address !== existingProject.address) ||
      (updateProjectDto.city !== undefined &&
        updateProjectDto.city !== existingProject.city) ||
      (updateProjectDto.state !== undefined &&
        updateProjectDto.state !== existingProject.state) ||
      (updateProjectDto.zipCode !== undefined &&
        updateProjectDto.zipCode !== existingProject.zipCode);

    const updateData: any = { ...updateProjectDto };

    if (addressFieldsChanged) {
      // Merge existing address fields with updates
      const mergedAddress = {
        address: updateProjectDto.address ?? existingProject.address,
        city: updateProjectDto.city ?? existingProject.city,
        state: updateProjectDto.state ?? existingProject.state,
        zipCode: updateProjectDto.zipCode ?? existingProject.zipCode,
      };
      updateData.location = this.computeLocation(mergedAddress);
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    // Log activity for name change
    if (updateProjectDto.name && updateProjectDto.name !== existingProject.name) {
      await this.activitiesService.logSettingsActivity(
        userId,
        id,
        `Renamed farm from "${existingProject.name}" to "${updateProjectDto.name}"`,
        { oldName: existingProject.name, newName: updateProjectDto.name },
      );
    }

    // Log activity for address change (only if values actually changed)
    if (addressFieldsChanged) {
      await this.activitiesService.logSettingsActivity(
        userId,
        id,
        'Updated farm address',
        {
          oldAddress: this.computeLocation(existingProject),
          newAddress: updateData.location,
        },
      );
    }

    // Log activity for module changes
    if (updateProjectDto.enabledModules) {
      const oldModules = existingProject.enabledModules || [];
      const newModules = updateProjectDto.enabledModules;

      // Find newly enabled modules
      for (const mod of newModules) {
        if (!oldModules.includes(mod)) {
          const moduleName = MODULE_NAMES[mod] || mod;
          await this.activitiesService.logModuleActivity(
            userId,
            id,
            `Enabled ${moduleName} module`,
            mod,
          );
        }
      }

      // Find newly disabled modules
      for (const mod of oldModules) {
        if (!newModules.includes(mod)) {
          const moduleName = MODULE_NAMES[mod] || mod;
          await this.activitiesService.logModuleActivity(
            userId,
            id,
            `Disabled ${moduleName} module`,
            mod,
          );
        }
      }
    }

    // Log activity for boundary changes
    if (updateProjectDto.boundary !== undefined) {
      const hadBoundary = !!existingProject.boundary;
      const hasBoundary = !!updateProjectDto.boundary;

      if (hasBoundary && !hadBoundary) {
        await this.activitiesService.logProjectActivity(
          userId,
          id,
          `Created farm boundary (${updateProjectDto.boundary.acres} acres)`,
        );
      } else if (hasBoundary && hadBoundary) {
        await this.activitiesService.logProjectActivity(
          userId,
          id,
          `Updated farm boundary (${updateProjectDto.boundary.acres} acres)`,
        );
      } else if (!hasBoundary && hadBoundary) {
        await this.activitiesService.logProjectActivity(
          userId,
          id,
          'Cleared farm boundary',
        );
      }
    }

    return updatedProject;
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId); // Verify ownership

    // Log activity before deletion (we log to the project being deleted)
    await this.activitiesService.logProjectActivity(
      userId,
      id,
      `Deleted farm: ${project.name}`,
    );

    // Delete all activities for this project
    await this.activitiesService.deleteByProject(id);

    await this.projectModel.findByIdAndDelete(id).exec();
  }

  async deleteAllByUserId(userId: string): Promise<number> {
    const result = await this.projectModel
      .deleteMany({ userId: new Types.ObjectId(userId) })
      .exec();
    return result.deletedCount;
  }

  async startNewSeason(id: string, userId: string): Promise<Project> {
    const project = await this.findOne(id, userId); // Verify ownership

    const now = new Date();
    const currentYear = now.getFullYear();

    // Mark current active season as inactive
    const updatedSeasons: Season[] = (project.seasons || []).map((season) => {
      if (season.isActive) {
        return {
          ...season,
          isActive: false,
          endDate: now,
        };
      }
      return season;
    });

    // Create new season
    const newSeason: Season = {
      id: uuidv4(),
      name: `${currentYear} growing season`,
      year: currentYear,
      startDate: now,
      isActive: true,
    };

    updatedSeasons.push(newSeason);

    // Update project with new seasons array and currentSeasonId
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(
        id,
        {
          seasons: updatedSeasons,
          currentSeasonId: newSeason.id,
        },
        { new: true },
      )
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    return updatedProject;
  }
}
