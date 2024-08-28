import BusinessUnit from '#models/business_unit'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await BusinessUnit.createMany([
      {
        businessUnitId: 1,
        businessUnitName: 'SAE',
        businessUnitSlug: 'sae',
        businessUnitLegalName: 'Servicios Aéreos Estrella, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 2,
        businessUnitName: 'SAE SILER',
        businessUnitSlug: 'sae-siler',
        businessUnitLegalName: 'Soluciones Integradas Corporativas Siler, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 3,
        businessUnitName: 'SAE QUORUM',
        businessUnitSlug: 'sae-quorum',
        businessUnitLegalName: 'Servicios, Soluciones y Marketing Quorum, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 4,
        businessUnitName: 'OAG SILER',
        businessUnitSlug: 'oag-siler',
        businessUnitLegalName: 'Soluciones Integradas Corporativas Siler, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 5,
        businessUnitName: 'OAG QUORUM',
        businessUnitSlug: 'oag-quorum',
        businessUnitLegalName: 'Servicios, Soluciones y Marketing Quorum, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 6,
        businessUnitName: 'CIMA',
        businessUnitSlug: 'cima',
        businessUnitLegalName: 'CIMA Aviación, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 7,
        businessUnitName: 'CIMA SILER',
        businessUnitSlug: 'cima-siler',
        businessUnitLegalName: 'Soluciones Integradas Corporativas Siler, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 8,
        businessUnitName: 'CIMA QUORUM',
        businessUnitSlug: 'cima-quorum',
        businessUnitLegalName: 'Servicios, Soluciones y Marketing Quorum, S.A. de C.V.',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 9,
        businessUnitName: 'Hi-kovcov',
        businessUnitSlug: 'hi-kovcov',
        businessUnitLegalName: 'Empresa Organización Institucional Bendakt, S.A. de C.V',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
      {
        businessUnitId: 10,
        businessUnitName: 'G.56',
        businessUnitSlug: 'g56',
        businessUnitLegalName: 'Empresa Organización Institucional Bendakt, S.A. de C.V',
        businessUnitActive: 1,
        businessUnitCreatedAt: DateTime.now(),
        businessUnitUpdatedAt: DateTime.now(),
      },
    ])
  }
}
