import { NextRequest, NextResponse } from 'next/server'
// Firebase Admin SDK는 환경 변수 설정 후 활성화
// import { getAuth } from 'firebase-admin/auth'
// import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Firebase Admin 초기화 (임시로 주석 처리)
// if (getApps().length === 0) {
//   const serviceAccount = JSON.parse(
//     process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
//   )

//   if (Object.keys(serviceAccount).length > 0) {
//     initializeApp({
//       credential: cert(serviceAccount as any),
//     })
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // const { provider, providerId, userInfo } = await request.json()

    // Firebase Admin이 초기화되지 않은 경우 - 임시로 null 반환
    // TODO: Firebase Admin SDK 설정 후 주석 해제
    return NextResponse.json({
      token: null,
      message: 'Firebase Admin not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY',
    })

    // Firebase Admin이 설정되면 아래 코드 활성화
    // if (getApps().length === 0) {
    //   return NextResponse.json({
    //     token: null,
    //     message: 'Firebase Admin not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY',
    //   })
    // }

    // const auth = getAuth()
    
    // Custom Token 생성
    // const customToken = await auth.createCustomToken(providerId, {
    //   provider,
    //   providerId,
    //   ...userInfo,
    // })

    // return NextResponse.json({ token: customToken })
  } catch (error: any) {
    console.error('Error creating custom token:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

