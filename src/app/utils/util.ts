export class Util {

    static INDUSTRY_LIST = [
        'Information Technologies',
        'Food - Agro', 
        'Food - Farming', 
        'Food - Fishing', 
        'Food - Gastronomy', 
        'Food - Nutrition', 
        'Biotechnology - Medical', 
        'Biotechnology - Nutrition', 
        'Biotechnology - Equipment', 
        'Construction - Real Estate', 
        'Construction - Architecture', 
        'Construction - Design',
        'Transport',
        'Sports',
        'Commerce',
        'Tourism',
        'Energy - Non-renewable',
        'Energy - Renewable',
        'Mining',
        'Manufacture - Textile',
        'Manufacture - Artisan',
        'Digital Fabrication',
        'Finance',

        'Aerospace',
        'Chemistry',
        'Engineering',
        'Forestry and Paper',
        'Metallurgy',
        'Industrial Manufacturing',
        'Logistics',
        'Electronics',
        'Automotive',
        'Fashion Industry',
        'Education',
        'Farmaceutical',
        'Mechanics',
        'Leatherworking',
        'Refresher',
        'Livestock',
        'Environment',
        'Restoration',
        'Others'
    ];

    static COUNTRY_LIST = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 
        'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 
        'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 
        'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 
        'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 
        'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 
        'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 
        'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 
        'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 
        'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 
        'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 
        'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 
        'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 
        'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 
        'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 
        '{Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 
        'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 
        'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 
        'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 
        'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 
        'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 
        'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 
        'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
        'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 
        'Zambia', 'Zimbabwe'];

    static DIMENSION_TO_NAME_MAP = new Map([
        [1, "Product"],
        [2, "Resources"],
        [3, "Information"],
        [4, "Organization"],
        [5, "Innovation"]
    ]);

    static DIMENSION_TO_COLOR = new Map([
        [1, '#ffc94a'],
        [2, '#118AB2'],
        [3, '#EF476F'],
        [4, '#073B4C'],
        [5, '#f77f00']
    ]);

    static SERVICE_TO_ICON = new Map([
        [1, 'settings_suggest'],
        [2, 'view_in_ar'],
        [3, 'precision_manufacturing'],
        [4, 'lens_blur'],
        [5, 'bolt'],
        [6, 'device_hub'],
        [7, 'sensors'],
        [8, 'memory'],
        [9, 'insights'],
        [10, 'groups'],
        [11, 'public'],
        [12, 'auto_awesome'],
        [13, 'model_training'],
        [14, 'attribution'],
        [15, 'psychology']
    ]);
}