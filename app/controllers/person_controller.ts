import { HttpContext } from '@adonisjs/core/http'
import { createPersonValidator, updatePersonValidator } from '../validators/person.js'
import Person from '#models/person'
import PersonService from '#services/person_service'

export default class PersonController {
  /**
   * @swagger
   * /api/persons:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Persons
   *     summary: create new person
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               personFirstname:
   *                 type: string
   *                 description: Person first name
   *                 required: true
   *                 default: ''
   *               personLastname:
   *                 type: string
   *                 description: Person last name
   *                 required: true
   *                 default: ''
   *               personSecondLastname:
   *                 type: string
   *                 description: Person second last name
   *                 required: true
   *                 default: ''
   *               personGender:
   *                 type: string
   *                 description: Person gender
   *                 required: false
   *                 default: ''
   *               personBirthday:
   *                 type: string
   *                 format: date
   *                 description: Person birthday (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               personPhone:
   *                 type: string
   *                 description: Person phone
   *                 required: false
   *                 default: ''
   *               personCurp:
   *                 type: string
   *                 description: Person CURP
   *                 required: false
   *                 default: ''
   *               personRfc:
   *                 type: string
   *                 description: Person RFC
   *                 required: false
   *                 default: ''
   *               personImssNss:
   *                 type: string
   *                 description: Person IMSS NSS
   *                 required: false
   *                 default: ''
   *     responses:
   *       '201':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async store({ request, response }: HttpContext) {
    try {
      const personFirstname = request.input('personFirstname')
      const personLastname = request.input('personLastname')
      const personSecondLastname = request.input('personSecondLastname')
      const personGender = request.input('personGender')
      const personBirthday = request.input('personBirthday')
      const personPhone = request.input('personPhone')
      const personCurp = request.input('personCurp')
      const personRfc = request.input('personRfc')
      const personImssNss = request.input('personImssNss')
      const person = {
        personFirstname: personFirstname,
        personLastname: personLastname,
        personSecondLastname: personSecondLastname,
        personGender: personGender,
        personBirthday: personBirthday,
        personPhone: personPhone,
        personCurp: personCurp,
        personRfc: personRfc,
        personImssNss: personImssNss,
      } as Person
      const personService = new PersonService()
      await request.validateUsing(createPersonValidator)
      const newPerson = await personService.create(person)
      if (newPerson) {
        response.status(201)
        return {
          type: 'success',
          title: 'Persons',
          message: 'The person was created successfully',
          data: { person: newPerson },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/persons/{personId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Persons
   *     summary: update person
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: personId
   *         schema:
   *           type: number
   *         description: Person id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               personFirstname:
   *                 type: string
   *                 description: Person first name
   *                 required: true
   *                 default: ''
   *               personLastname:
   *                 type: string
   *                 description: Person last name
   *                 required: true
   *                 default: ''
   *               personSecondLastname:
   *                 type: string
   *                 description: Person second last name
   *                 required: true
   *                 default: ''
   *               personGender:
   *                 type: string
   *                 description: Person gender
   *                 required: false
   *                 default: ''
   *               personBirthday:
   *                 type: string
   *                 format: date
   *                 description: Person birthday (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               personPhone:
   *                 type: string
   *                 description: Person phone
   *                 required: false
   *                 default: ''
   *               personCurp:
   *                 type: string
   *                 description: Person CURP
   *                 required: false
   *                 default: ''
   *               personRfc:
   *                 type: string
   *                 description: Person RFC
   *                 required: false
   *                 default: ''
   *               personImssNss:
   *                 type: string
   *                 description: Person IMSS NSS
   *                 required: false
   *                 default: ''
   *     responses:
   *       '201':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async update({ request, response }: HttpContext) {
    try {
      const personId = request.param('personId')
      const personFirstname = request.input('personFirstname')
      const personLastname = request.input('personLastname')
      const personSecondLastname = request.input('personSecondLastname')
      const personGender = request.input('personGender')
      const personBirthday = request.input('personBirthday')
      const personPhone = request.input('personPhone')
      const personCurp = request.input('personCurp')
      const personRfc = request.input('personRfc')
      const personImssNss = request.input('personImssNss')
      const person = {
        personId: personId,
        personFirstname: personFirstname,
        personLastname: personLastname,
        personSecondLastname: personSecondLastname,
        personGender: personGender,
        personBirthday: personBirthday,
        personPhone: personPhone,
        personCurp: personCurp,
        personRfc: personRfc,
        personImssNss: personImssNss,
      } as Person
      if (!personId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The person Id was not found',
          message: 'Missing data to process',
          data: { ...person },
        }
      }
      const currentPerson = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', personId)
        .first()
      if (!currentPerson) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { ...person },
        }
      }
      const personService = new PersonService()
      const data = await request.validateUsing(updatePersonValidator)
      const verifyInfo = await personService.verifyInfo(person)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updatePerson = await personService.update(currentPerson, person)
      if (updatePerson) {
        response.status(201)
        return {
          type: 'success',
          title: 'Persons',
          message: 'The person was updated successfully',
          data: { person: updatePerson },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/persons/{personId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Persons
   *     summary: delete person
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: personId
   *         schema:
   *           type: number
   *         description: Person id
   *         required: true
   *     responses:
   *       '201':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async delete({ request, response }: HttpContext) {
    try {
      const personId = request.param('personId')
      if (!personId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The person Id was not found',
          message: 'Missing data to process',
          data: { personId },
        }
      }
      const currentPerson = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', personId)
        .first()
      if (!currentPerson) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { personId },
        }
      }
      const personService = new PersonService()
      const deletePerson = await personService.delete(currentPerson)
      if (deletePerson) {
        response.status(201)
        return {
          type: 'success',
          title: 'Person',
          message: 'The person was deleted successfully',
          data: { person: deletePerson },
        }
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }
}
