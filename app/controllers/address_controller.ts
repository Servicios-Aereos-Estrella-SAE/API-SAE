import { HttpContext } from '@adonisjs/core/http'
import Address from '#models/address'
import AddressService from '#services/address_service'
import { createAddressValidator, updateAddressValidator } from '#validators/address'

export default class AddressController {
  /**
   * @swagger
   * /api/address:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Address
   *     summary: create new address
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               addressZipcode:
   *                 type: string
   *                 description: Address zipcode
   *                 required: true
   *                 default: ''
   *               addressCountry:
   *                 type: string
   *                 description: Address country
   *                 required: true
   *                 default: ''
   *               addressState:
   *                 type: string
   *                 description: Address state
   *                 required: true
   *                 default: ''
   *               addressTownship:
   *                 type: string
   *                 description: Address township
   *                 required: true
   *                 default: ''
   *               addressCity:
   *                 type: string
   *                 format: date
   *                 description: Address city
   *                 required: true
   *                 default: ''
   *               addressSettlement:
   *                 type: string
   *                 description: Address settlement
   *                 required: true
   *                 default: ''
   *               addressSettlementType:
   *                 type: string
   *                 description: Address settlement type
   *                 required: false
   *                 default: ''
   *               addressStreet:
   *                 type: string
   *                 description: Address street
   *                 required: true
   *                 default: ''
   *               addressInternalNumber:
   *                 type: string
   *                 description: Address internal number
   *                 required: false
   *                 default: ''
   *               addressExternalNumber:
   *                 type: string
   *                 description: Address external number
   *                 required: false
   *                 default: ''
   *               addressBetweenStreet1:
   *                 type: string
   *                 description: Address between street 1
   *                 required: false
   *                 default: ''
   *               addressBetweenStreet2:
   *                 type: string
   *                 description: Address between street 2
   *                 required: false
   *                 default: ''
   *               addressTypeId:
   *                 type: number
   *                 description: Address type id
   *                 required: true
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
      const addressZipcode = request.input('addressZipcode')
      const addressCountry = request.input('addressCountry')
      const addressState = request.input('addressState')
      const addressTownship = request.input('addressTownship')
      const addressCity = request.input('addressCity')
      const addressSettlement = request.input('addressSettlement')
      const addressSettlementType = request.input('addressSettlementType')
      const addressStreet = request.input('addressStreet')
      const addressInternalNumber = request.input('addressInternalNumber')
      const addressExternalNumber = request.input('addressExternalNumber')
      const addressBetweenStreet1 = request.input('addressBetweenStreet1')
      const addressBetweenStreet2 = request.input('addressBetweenStreet2')
      const addressTypeId = request.input('addressTypeId')
      const address = {
        addressZipcode: addressZipcode,
        addressCountry: addressCountry,
        addressState: addressState,
        addressTownship: addressTownship,
        addressCity: addressCity,
        addressSettlement: addressSettlement,
        addressSettlementType: addressSettlementType,
        addressStreet: addressStreet,
        addressInternalNumber: addressInternalNumber,
        addressExternalNumber: addressExternalNumber,
        addressBetweenStreet1: addressBetweenStreet1,
        addressBetweenStreet2: addressBetweenStreet2,
        addressTypeId: addressTypeId,
      } as Address
      const addressService = new AddressService()
      await request.validateUsing(createAddressValidator)
      const verifyExist = await addressService.verifyInfoExist(address)
      if (verifyExist.status !== 200) {
        response.status(verifyExist.status)
        return {
          type: verifyExist.type,
          title: verifyExist.title,
          message: verifyExist.message,
          data: { ...address },
        }
      }
      const newAddress = await addressService.create(address)
      if (newAddress) {
        response.status(201)
        return {
          type: 'success',
          title: 'Address',
          message: 'The address was created successfully',
          data: { address: newAddress },
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
   * /api/address/{addressId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Address
   *     summary: update address
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: addressId
   *         schema:
   *           type: number
   *         description: Address id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               addressZipcode:
   *                 type: string
   *                 description: Address zipcode
   *                 required: true
   *                 default: ''
   *               addressCountry:
   *                 type: string
   *                 description: Address country
   *                 required: true
   *                 default: ''
   *               addressState:
   *                 type: string
   *                 description: Address state
   *                 required: true
   *                 default: ''
   *               addressTownship:
   *                 type: string
   *                 description: Address township
   *                 required: true
   *                 default: ''
   *               addressCity:
   *                 type: string
   *                 format: date
   *                 description: Address city
   *                 required: true
   *                 default: ''
   *               addressSettlement:
   *                 type: string
   *                 description: Address settlement
   *                 required: true
   *                 default: ''
   *               addressSettlementType:
   *                 type: string
   *                 description: Address settlement type
   *                 required: false
   *                 default: ''
   *               addressStreet:
   *                 type: string
   *                 description: Address street
   *                 required: true
   *                 default: ''
   *               addressInternalNumber:
   *                 type: string
   *                 description: Address internal number
   *                 required: false
   *                 default: ''
   *               addressExternalNumber:
   *                 type: string
   *                 description: Address external number
   *                 required: false
   *                 default: ''
   *               addressBetweenStreet1:
   *                 type: string
   *                 description: Address between street 1
   *                 required: false
   *                 default: ''
   *               addressBetweenStreet2:
   *                 type: string
   *                 description: Address between street 2
   *                 required: false
   *                 default: ''
   *               addressTypeId:
   *                 type: number
   *                 description: Address type id
   *                 required: true
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
      const addressId = request.param('addressId')
      const addressZipcode = request.input('addressZipcode')
      const addressCountry = request.input('addressCountry')
      const addressState = request.input('addressState')
      const addressTownship = request.input('addressTownship')
      const addressCity = request.input('addressCity')
      const addressSettlement = request.input('addressSettlement')
      const addressSettlementType = request.input('addressSettlementType')
      const addressStreet = request.input('addressStreet')
      const addressInternalNumber = request.input('addressInternalNumber')
      const addressExternalNumber = request.input('addressExternalNumber')
      const addressBetweenStreet1 = request.input('addressBetweenStreet1')
      const addressBetweenStreet2 = request.input('addressBetweenStreet2')
      const addressTypeId = request.input('addressTypeId')
      const address = {
        addressId: addressId,
        addressZipcode: addressZipcode,
        addressCountry: addressCountry,
        addressState: addressState,
        addressTownship: addressTownship,
        addressCity: addressCity,
        addressSettlement: addressSettlement,
        addressSettlementType: addressSettlementType,
        addressStreet: addressStreet,
        addressInternalNumber: addressInternalNumber,
        addressExternalNumber: addressExternalNumber,
        addressBetweenStreet1: addressBetweenStreet1,
        addressBetweenStreet2: addressBetweenStreet2,
        addressTypeId: addressTypeId,
      } as Address
      if (!addressId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The address Id was not found',
          data: { ...address },
        }
      }
      const currentAddress = await Address.query()
        .whereNull('address_deleted_at')
        .where('address_id', addressId)
        .first()
      if (!currentAddress) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The address was not found',
          message: 'The address was not found with the entered ID',
          data: { ...address },
        }
      }
      const addressService = new AddressService()
      const data = await request.validateUsing(updateAddressValidator)
      const verifyExist = await addressService.verifyInfoExist(address)
      if (verifyExist.status !== 200) {
        response.status(verifyExist.status)
        return {
          type: verifyExist.type,
          title: verifyExist.title,
          message: verifyExist.message,
          data: { ...data },
        }
      }
      const updateAddress = await addressService.update(currentAddress, address)
      if (updateAddress) {
        response.status(201)
        return {
          type: 'success',
          title: 'Persons',
          message: 'The person was updated successfully',
          data: { person: updateAddress },
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
