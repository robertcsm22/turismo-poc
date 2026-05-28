# 🔐 Configuración Google SSO — Guía completa

## Por qué este enfoque (One Tap / GSI)

El proyecto usa la librería **Google Identity Services (GSI)** con el flujo
`credential_response` (ID Token). Esto es más sencillo que OAuth completo:

```
Usuario → click en botón Google → Google devuelve un "credential" (JWT firmado por Google)
→ frontend lo envía al backend → backend lo verifica con GoogleIdTokenVerifier → emite su propio JWT
```

No necesitas manejar redirect URIs complejas ni authorization codes.

---

## Paso 1 — Crear proyecto en Google Cloud Console

1. Ve a https://console.cloud.google.com
2. Clic en **"Select a project"** → **"New Project"**
3. Nombre: `turismo-poc` → **Create**

---

## Paso 2 — Configurar la pantalla de consentimiento OAuth

1. Menú izquierdo → **APIs & Services** → **OAuth consent screen**
2. Seleccionar **External** → **Create**
3. Completar:
   - **App name:** Turismo Local
   - **User support email:** tu correo
   - **Developer contact:** tu correo
4. **Save and Continue** (las demás pantallas puedes dejarlas por defecto para PoC)
5. En **"Test users"** agrega los correos Gmail que usarás para probar

---

## Paso 3 — Crear credenciales OAuth 2.0

1. **APIs & Services** → **Credentials** → **+ Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Turismo Web Client`
4. **Authorized JavaScript origins** (importante para Google Sign-In botón):
   ```
   http://localhost:5173
   http://localhost:3000
   https://turismo-poc.web.app       ← tu dominio en producción
   ```
5. **Authorized redirect URIs** (para el flujo de botón GSI no es estrictamente necesario, pero agregar):
   ```
   http://localhost:5173
   https://turismo-poc.web.app
   ```
6. Clic **Create**
7. **Copiar el Client ID** — se verá así:
   ```
   123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

---

## Paso 4 — Configurar en el proyecto

### Frontend (.env.local)
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### Backend (variable de entorno / application.yml)
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### GitHub Secrets (para CI/CD)
En tu repositorio → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Valor |
|---|---|
| `GOOGLE_CLIENT_ID` | Tu client ID de Google |
| `JWT_SECRET` | String aleatorio largo (mínimo 32 chars) |
| `DATABASE_URL` | URL de tu PostgreSQL en Cloud SQL |
| `DATABASE_USER` | Usuario de BD |
| `DATABASE_PASSWORD` | Contraseña de BD |
| `GCP_SA_KEY` | JSON de service account de GCP (base64) |
| `FIREBASE_PROJECT_ID` | ID de tu proyecto Firebase |
| `API_URL` | URL pública del backend en Cloud Run |

---

## Paso 5 — Cómo funciona el flujo en código

### Frontend (LoginPage.jsx)
```js
// 1. El SDK de Google se inicializa con tu Client ID
window.google.accounts.id.initialize({
  client_id: GOOGLE_CLIENT_ID,
  callback: handleGoogleResponse,  // Se llama cuando el usuario hace login
})

// 2. Cuando el usuario hace click en el botón de Google,
//    Google llama a handleGoogleResponse con:
const handleGoogleResponse = async (response) => {
  // response.credential es el ID Token de Google (un JWT)
  const authResponse = await authService.loginWithGoogle(response.credential)
  // authResponse contiene { token: "tu-jwt", user: {...} }
  login(authResponse)
}
```

### Backend (AuthService.java)
```java
// 3. El backend verifica que el ID Token fue firmado por Google
GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(...)
    .setAudience(Collections.singletonList(googleClientId))
    .build();

GoogleIdToken idToken = verifier.verify(tokenString);
// Si pasa la verificación → el token es auténtico

// 4. Extraer datos del usuario
GoogleIdToken.Payload payload = idToken.getPayload();
String email = payload.getEmail();      // correo Gmail verificado
String name = (String) payload.get("name");
String picture = (String) payload.get("picture");

// 5. Crear/actualizar usuario en BD y emitir JWT propio
String jwt = jwtTokenProvider.generateToken(email, role);
```

---

## Errores frecuentes

| Error | Solución |
|---|---|
| `idpiframe_initialization_failed` | El origen del frontend no está en "Authorized JavaScript origins" |
| `Token audience mismatch` | El `GOOGLE_CLIENT_ID` del backend no coincide con el del frontend |
| `Token expired` | El ID Token de Google expira en 1 hora; el flujo debe ser inmediato |
| `Solo se aceptan cuentas @gmail.com` | El enunciado lo exige; el código verifica `email.endsWith("@gmail.com")` |
| Botón no aparece | Verificar que el script GSI se cargó (revisar Network tab en DevTools) |

---

## Verificar que funciona

1. Corre el backend: `mvn spring-boot:run`
2. Corre el frontend: `npm run dev`
3. Ve a `http://localhost:5173/p/santa-teresa`
4. Deberías ver la pantalla de login con el nombre del pueblo
5. Haz clic en **Continuar con Google** → selecciona tu Gmail
6. Deberías ser redirigido a `/lugares/santa-teresa` con las tarjetas de lugares

Si ves el spinner girando indefinidamente, revisar la consola del navegador y los logs del backend.
