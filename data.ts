export const configuratorCombinedData = [
  {
    name: 'Soccer',
    glbUrl: '/3d/models/glowjerseys.glb',

    sections: [
      {
        name: 'Name&Number',
        uiType: 'TwoInputCombined',

      },

      {
        name: 'Jersey Color',
        uiType: 'colorSwatch',
        options: [
          {
            name: 'Black',
            hexCode: '#000000',
            type: 'hexCode',
          },
          {
            name: 'Royal Blue',
            hexCode: '#0F539E',
            type: 'hexCode',
          },
          {
            name: 'Blonde',
            type: 'hexCode',
            hexCode: '#F4DDA3',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Name Color',
        uiType: 'colorSwatch',
        options: [
          {
            name: 'Black',
            hexCode: '#000000',
            type: 'hexCode',
          },
          {
            name: 'Royal Blue',
            hexCode: '#0F539E',
            type: 'hexCode',
          },
          {
            name: 'Blonde',
            type: 'hexCode',
            hexCode: '#F4DDA3',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Number Color',
        uiType: 'colorSwatch',
        options: [
          {
            name: 'Black',
            hexCode: '#000000',
            type: 'hexCode',
          },
          {
            name: 'Royal Blue',
            hexCode: '#0F539E',
            type: 'hexCode',
          },
          {
            name: 'Blonde',
            type: 'hexCode',
            hexCode: '#F4DDA3',
            isDefault: true,
          },
        ],
      },
    ],
  },
];
