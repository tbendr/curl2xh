xh :28139 "foo==bar" "baz==qux"


xh :28139/ \
  "prmsare==perurl" \
  "secondparam==yesplease" \
  "foo==bar" \
  "baz==qux"


xh ":28139?trailingamper=shouldwork&&foo=bar&baz=qux"


xh ":28139?noequalshouldnt&foo=bar&baz=qux"
