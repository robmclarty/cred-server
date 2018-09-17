Create keys using elliptic curve encryption. Note: I'm using the built-in
secp521r1 curve but you could use a different one if you like. To get a list of
available curves, enter `openssl ecparam -list_curves`. Also see
http://safecurves.cr.yp.to/ for comparison of curves and their security.

Generate P-521 curve private/public key pair:
`openssl ecparam -name secp521r1 -genkey -noout -out private.pem`

Save public key to its own file (for distribution):
`openssl ec -in private.pem -out public.pem -pubout`
