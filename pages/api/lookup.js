import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone_number } = req.body;
  let number = phone_number;

  // Remove all spaces and non-digit characters except leading +
  number = number.replace(/[^\d+]/g, '');

  // Correct +885 to +855 (common typo for Cambodian country code)
  if (number.startsWith('+885')) {
    number = '+855' + number.slice(4);
  }

  // Handle numbers starting with 0 or without 0 (e.g., 081218840 or 81218840)
  if (number.startsWith('0') && !number.startsWith('+')) {
    number = '+855' + number.slice(1);
  } else if (!number.startsWith('+') && /^[1-9]/.test(number)) {
    number = '+855' + number;
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
      const prefix = number.replace('+855', '').substring(0, 2);
      const carrierMap = {
        '10': 'Smart',
        '11': 'Cellcard',
        '12': 'Cellcard',
        '14': 'Cellcard',
        '15': 'Smart',
        '16': 'Smart',
        '17': 'Cellcard',
        '31': 'Metfone',
        '60': 'Metfone',
        '61': 'Cellcard',
        '66': 'Metfone',
        '67': 'Metfone',
        '68': 'Metfone',
        '69': 'Smart',
        '70': 'Smart',
        '71': 'Metfone',
        '76': 'Cellcard',
        '77': 'Cellcard',
        '78': 'Cellcard',
        '79': 'Cellcard',
        '81': 'Smart',
        '85': 'Cellcard',
        '86': 'Smart',
        '87': 'Smart',
        '88': 'Metfone',
        '89': 'Cellcard',
        '90': 'Metfone',
        '92': 'Cellcard',
        '93': 'Smart',
        '95': 'Cellcard',
        '96': 'Smart',
        '97': 'Metfone',
        '98': 'Smart',
        '99': 'Cellcard'
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
    res.status(400).json({ error: 'Invalid format. Use formats like 81218840, 081218840, +85581218840, or +855 81218840.' });
  }
}