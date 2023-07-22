export default {
    name: 'Womens__Shoes',
    title: 'Womens__Shoes',
    type: 'document',
    fields: [
        {
            name:'Shoe__Name',
            title: 'Shoe__Name',
            type: 'string'
        },
        {
            name: 'Shoe__Image',
            title: 'Shoe__Image',
            type: `image`
        },
        {
            name: `Shoe__Sizes`,
            title: `Shoe__Sizes`,
            type: `array`,
            of: [
                {
                    type: 'object',
                    fields: [
                      {
                        name: 'size',
                        title: 'Size',
                        type: 'number'
                      },
                      {
                        name: 'quantity',
                        title: 'Quantity',
                        type: 'number'
                      },
                      {
                        name: 'price',
                        title: 'Price',
                        type: 'number'
                      }
                    ]
                }
            ]
        }

    ]
}