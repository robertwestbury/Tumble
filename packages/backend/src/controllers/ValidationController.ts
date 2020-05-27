import { Controller, Post, UseBefore, PathParams, Req, Get, Delete, Patch, Res, BodyParams, Locals } from '@tsed/common';
import { RequireAuth } from '../middleware/RequireAuth';

import { Request, Response } from 'express';
import { db } from '../Prisma';
import { NotFound, BadRequest } from 'ts-httpexceptions';
import { CreateRuleModel } from './models/CreareRuleModel';

import { ValidationService } from '../services/ValidationService';
import { ValidationRule, Form } from '@prisma/client';
import { RequireFormOwner } from '../middleware/RequireFormOwner';
import { RequireFormAccess } from '../middleware/RequireFormAccess';
import { EditValidationModel } from './EditValidationModel';
import { EditRuleModel } from './models/EditRuleModel';
import { removeFalsyValues } from '../util/removeFalsyValues';

@Controller('/validation')
export class ValidationController {
  public constructor(private readonly validationService: ValidationService) {}

  @Get('/rules')
  getRules() {
    return this.validationService.meta;
  }

  @Post('/:formId')
  @UseBefore(RequireAuth, RequireFormAccess)
  async create(@PathParams('formId') formId: string, @Req() req: Request, @Locals('form') f: Form) {
    const form = await db.form.findOne({ where: { id: f.id }, include: { validation: true } });

    if (form!.validation) throw new BadRequest('Validation is already setup for this form');

    const validation = await db.validation.create({ data: { form: { connect: { id: form!.id } } }, include: { rules: true } });

    return validation;
  }

  @Delete('/:formId')
  @UseBefore(RequireAuth, RequireFormAccess)
  async delete(@PathParams('formId') formId: string, @Req() req: Request) {
    const form = await db.form.findOne({ where: { id: formId }, include: { validation: true } });

    if (!form) throw new NotFound('Form not found');
    if (!form.validation) throw new BadRequest('There is no validation setup for this form');

    await db.validation.delete({ where: { id: form.validation.id } });

    return 'Validation deleted';
  }

  @Get('/:formId')
  @UseBefore(RequireAuth, RequireFormAccess)
  async get(@PathParams('formId') formId: string, @Req() req: Request) {
    const form = await db.form.findOne({ where: { id: formId }, include: { validation: { include: { rules: true } } } });

    if (!form) throw new NotFound('Form not found');

    if (!form.validation) throw new NotFound('No validation setup');

    return form.validation;
  }

  @Patch('/:formId')
  @UseBefore(RequireAuth, RequireFormAccess)
  async edit(@Locals('form') form: Form, @Req() req: Request, @BodyParams() data: EditValidationModel) {
    const validation = await db.form.findOne({ where: { id: form.id } }).validation();
    const rules = await db.validationRule.findMany({ where: { validationId: validation!.id } });

    for (const rule of rules) {
      const meta = this.validationService.meta[rule.validator];

      if (data.strict === true && meta.nonStrictOnly) await db.validationRule.delete({ where: { id: rule.id } });
      if (data.strict === false && meta.strictOnly) await db.validationRule.delete({ where: { id: rule.id } });
    }

    return await db.validation.update({ where: { id: validation!.id }, data });
  }

  @Delete('/:formId/:ruleId')
  @UseBefore(RequireAuth, RequireFormAccess)
  async deleteRule(@PathParams('ruleId') ruleId: number, @Req() req: Request) {
    const rule = await db.validationRule.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFound('Rule not found');

    await db.validationRule.delete({ where: { id: ruleId } });

    return 'Rule deleted';
  }

  @Patch('/:formId/:ruleId')
  async editRule(@PathParams('ruleId') ruleId: number, @Req() req: Request, @BodyParams() data: EditRuleModel) {
    const rule = await db.validationRule.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFound('Rule not found');

    if (this.validationService.meta[rule.validator].requireDetail && !data.detail) throw new BadRequest('This rule requires a detail');

    return await db.validationRule.update({ where: { id: rule.id }, data });
  }

  @Post('/:formId/rule')
  @UseBefore(RequireAuth, RequireFormAccess)
  async createRule(@BodyParams() { field, validator, detail, errorMessage }: CreateRuleModel, @PathParams('formId') formId: string, @Req() req: Request) {
    const meta = this.validationService.meta[validator];

    if (!Object.keys(this.validationService.meta).includes(validator)) throw new NotFound('Action not found');
    if (meta.requireDetail && !detail) throw new BadRequest('This action requires a detail');

    const form = await db.form.findOne({ where: { id: formId }, include: { validation: { include: { rules: true } } } });
    if (!form) throw new NotFound('Form not found');

    if (meta.required && form.validation!.rules.find(r => this.validationService.meta[r.validator].required && r.field === field))
      throw new BadRequest(`There is a rule that conflicts with this rule. Please remove it and try again.`);

    if (form.validation!.rules.find(r => r.validator === validator && r.field === field))
      throw new BadRequest('You already have a rule for this field with the same action');

    let rule: ValidationRule;

    if (meta.requireDetail) {
      rule = await db.validationRule.create({ data: { validation: { connect: { id: form.validation!.id } }, validator, detail, field, errorMessage } });
    } else {
      rule = await db.validationRule.create({ data: { validation: { connect: { id: form.validation!.id } }, validator, field, errorMessage } });
    }

    return rule;
  }
}
