import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    // console.log('Starting force fix for specific products...');
    
    // Check current state of specific products
    const { rows: beforeCheck } = await sql`
      SELECT id, name, sellerId, sellerid 
      FROM products 
      WHERE id IN ('18', '19', '20', '1768730198049')
      ORDER BY id
    `;
    
    // console.log('Before force fix:', beforeCheck);
    
    // Force update specific products one by one
    const updates = [
      { id: '18', sellerId: 'ymohammad18@gmail.com', name: 'Portable SSD 1TB' },
      { id: '19', sellerId: 'ymohammad18@gmail.com', name: 'Wireless Mouse Pro' },
      { id: '20', sellerId: 'ymohammad18@gmail.com', name: 'USB-C Hub 7-in-1' },
      { id: '1768730198049', sellerId: 'ymohammad18@gmail.com', name: 'RTX 3060 MSI Gaming X' }
    ];
    
    const results = [];
    
    for (const update of updates) {
      try {
        // Try both sellerId and sellerid (case sensitivity issue)
        // console.log(`Updating product ${update.id} to sellerId: ${update.sellerId}`);
        
        const { rowCount: camelCaseUpdate } = await sql`
          UPDATE products 
          SET sellerId = ${update.sellerId}
          WHERE id = ${update.id}
        `;
        
        const { rowCount: lowerCaseUpdate } = await sql`
          UPDATE products 
          SET sellerid = ${update.sellerId}
          WHERE id = ${update.id}
        `;
        
        const totalRowCount = camelCaseUpdate + lowerCaseUpdate;
        
        // console.log(`Product ${update.id} update result: camelCase=${camelCaseUpdate}, lowerCase=${lowerCaseUpdate}, total=${totalRowCount}`);
        
        // Verify the update with both column names
        const { rows: verify } = await sql`
          SELECT id, name, sellerId, sellerid 
          FROM products 
          WHERE id = ${update.id}
        `;
        
        results.push({
          id: update.id,
          name: update.name,
          rowsUpdated: totalRowCount,
          camelCaseRows: camelCaseUpdate,
          lowerCaseRows: lowerCaseUpdate,
          newSellerId: verify[0]?.sellerId || verify[0]?.sellerid,
          verifyData: verify[0],
          success: totalRowCount > 0
        });
        
      } catch (error) {
        // console.error(`Error updating product ${update.id}:`, error);
        results.push({
          id: update.id,
          name: update.name,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }
    
    // Final verification
    const { rows: afterCheck } = await sql`
      SELECT id, name, sellerId, sellerid 
      FROM products 
      WHERE id IN ('18', '19', '20', '1768730198049')
      ORDER BY id
    `;
    
    // console.log('After force fix:', afterCheck);
    
    return NextResponse.json({
      success: true,
      message: 'Force fix completed',
      beforeFix: beforeCheck,
      afterFix: afterCheck,
      updateResults: results,
      summary: {
        totalAttempted: updates.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });
    
  } catch (error) {
    console.error('Force fix error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Force fix failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}