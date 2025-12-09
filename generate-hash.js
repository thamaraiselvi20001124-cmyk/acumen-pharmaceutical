import bcrypt from 'bcrypt';

// For Admin
const adminPassword = 'Ac#2025$Pharm@SecAdmin';
const adminHash = await bcrypt.hash(adminPassword, 10);
console.log('Admin Password Hash:', adminHash);

// For Designer  
const designerPassword = 'D3s!gn@Acumen#2025Pvt';
const designerHash = await bcrypt.hash(designerPassword, 10);
console.log('Designer Password Hash:', designerHash);

console.log('\n=== SECURE PASSWORDS ===');
console.log('Admin Username: acumen_admin_2025');
console.log('Admin Password:', adminPassword);
console.log('\nDesigner Username: designer_acumen_2025');
console.log('Designer Password:', designerPassword);

console.log('\n=== UPDATE .env FILE WITH THESE HASHES ===');
console.log('ADMIN_PASSWORD_HASH=' + adminHash);
console.log('DESIGNER_PASSWORD_HASH=' + designerHash);
