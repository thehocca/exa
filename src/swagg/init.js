const components= {
    schemas: {
      HealtCheck: {
        type: 'object',
        properties: {
            statusCode: {
            type: 'integer',
          },
          body: {
            type: 'object',
            properties:{
                random:{
                    type:'string'
                }
            }
          },
          time: {
            type: 'string',
            format: 'date'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer'
          },
          message: {
            type: 'string'
          }
        }
      }
    }
  }
  
  module.exports={components}