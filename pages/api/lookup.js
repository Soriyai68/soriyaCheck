import { PhoneNumberUtil, PhoneNumberFormat, PhoneNumberType } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { phone_number } = req.body;
  let number = phone_number;
  if (number.startsWith('0') && !number.startsWith('+')) {
    number = '+855' + number.slice(1);
  }
  try {
    const parsed = phoneUtil.parseAndKeepRawInput(number, 'KH');
    if (!phoneUtil.isValidNumber(parsed)) {
      return res.status(400).json({ error: 'Invalid phone number.' });
    }
    if (phoneUtil.getRegionCodeForNumber(parsed) !== 'KH') {
      return res.status(400).json({ error: 'Please enter a Cambodian phone number.' });
    }
    // Carrier detection
    let provider = 'Unknown';
    try {
      // google-libphonenumber does not provide carrier by default, so we use prefix mapping
      const prefix = number.replace('+855', '').substring(0, 2);
      const carrierMap = {
        '10': 'Cellcard', '11': 'Cellcard', '12': 'Cellcard', '13': 'Cellcard', '14': 'Cellcard', '15': 'Cellcard', '16': 'Smart', '17': 'Cellcard', '18': 'Smart', '60': 'Smart', '61': 'Smart', '66': 'Smart', '67': 'Smart', '68': 'Smart', '69': 'Smart', '70': 'Metfone', '71': 'Metfone', '77': 'Metfone', '78': 'Metfone', '79': 'Metfone', '81': 'Smart', '85': 'Cellcard', '86': 'Smart', '87': 'Smart', '88': 'Smart', '89': 'Smart', '90': 'Cellcard', '92': 'Cellcard', '93': 'Cellcard', '95': 'Cellcard', '96': 'Smart', '97': 'Metfone', '98': 'Cellcard', '99': 'Smart'
      };
      if (carrierMap[prefix]) provider = carrierMap[prefix];
    } catch {}
    res.json({
      number: phoneUtil.format(parsed, PhoneNumberFormat.INTERNATIONAL),
      location: 'Cambodia',
      provider,
      timezones: ['Asia/Phnom_Penh']
    });
  } catch {
    res.status(400).json({ error: 'Invalid format. Use 012345678 or +85512345678.' });
  }
}
